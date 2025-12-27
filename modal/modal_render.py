"""
Modal serverless function for rendering Remotion videos.
This function creates a Node.js sandbox, runs the Remotion render,
uploads the result to S3, and calls the backend callback.
"""

import modal
import os
import json
import tempfile
import subprocess
import urllib.request
import urllib.parse

# Define the Modal app
app = modal.App("flowcut-render")

# Create a custom image with Node.js and required dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("curl", "git", "chromium", "ffmpeg")
    .run_commands(
        # Install Node.js 20.x
        "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
        "apt-get install -y nodejs",
        # Install pnpm for faster package installation
        "npm install -g pnpm",
    )
    .pip_install("boto3", "requests")
)


@app.function(
    image=image,
    timeout=900,  # 15 minutes max
    memory=8192,  # 8GB RAM for rendering
    cpu=4.0,
    secrets=[modal.Secret.from_name("flowcut-aws")],
)
@modal.web_endpoint(method="POST")
def render_video(data: dict):
    """
    Render a Remotion video and upload to S3.
    
    Expects JSON body with:
        job_id: Unique identifier for this render job
        template_id: Remotion composition ID (e.g., "template1")
        duration: Duration in frames
        props: Input props for the Remotion composition
        width: Video width in pixels (default 1080)
        height: Video height in pixels (default 1920)
        fps: Frames per second (default 30)
        callback_url: URL to POST completion status
    
    Returns:
        dict with success status and S3 URL
    """
    import boto3
    import requests
    
    # Extract parameters from data dict
    job_id = data.get("job_id", "unknown")
    template_id = data.get("template_id", "template1")
    duration = data.get("duration", 150)
    props = data.get("props", {})
    width = data.get("width", 1080)
    height = data.get("height", 1920)
    fps = data.get("fps", 30)
    callback_url = data.get("callback_url")
    
    print(f"[Modal] Starting render for job {job_id}")
    print(f"[Modal] Template: {template_id}, Duration: {duration} frames")
    
    # Create a temporary directory for the project
    with tempfile.TemporaryDirectory() as work_dir:
        project_dir = os.path.join(work_dir, "flowcut")
        output_path = os.path.join(work_dir, "output.mp4")
        
        # Clone or copy the project files
        # For now, we'll create the minimal Remotion structure needed
        print("[Modal] Setting up Remotion project...")
        
        # Create package.json
        package_json = {
            "name": "flowcut-render",
            "version": "1.0.0",
            "dependencies": {
                "@remotion/bundler": "^4.0.0",
                "@remotion/cli": "^4.0.0",
                "@remotion/renderer": "^4.0.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "remotion": "^4.0.0"
            }
        }
        
        os.makedirs(project_dir, exist_ok=True)
        with open(os.path.join(project_dir, "package.json"), "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Write props to a file
        props_path = os.path.join(work_dir, "props.json")
        with open(props_path, "w") as f:
            json.dump(props, f)
        
        print("[Modal] Installing dependencies...")
        subprocess.run(
            ["pnpm", "install", "--prefer-offline"],
            cwd=project_dir,
            check=True,
            capture_output=True,
        )
        
        # For a real implementation, we need to copy the remotion folder
        # This would be done via a Modal Volume or by fetching from a URL
        # For now, we'll use the bundled project approach
        
        print("[Modal] Running Remotion render...")
        
        # Build the render command
        render_cmd = [
            "npx", "remotion", "render",
            "remotion/Root.tsx",
            template_id,
            output_path,
            "--props", props_path,
            "--width", str(width),
            "--height", str(height),
            "--frames", f"0-{duration - 1}",
            "--fps", str(fps),
            "--codec", "h264",
            "--concurrency", "2",
            "--timeout", "180000",
            "--overwrite",
        ]
        
        result = subprocess.run(
            render_cmd,
            cwd=project_dir,
            capture_output=True,
            text=True,
        )
        
        if result.returncode != 0:
            error_msg = result.stderr or result.stdout or "Unknown render error"
            print(f"[Modal] Render failed: {error_msg}")
            
            # Call callback with failure
            if callback_url:
                try:
                    requests.post(
                        callback_url,
                        json={
                            "jobId": job_id,
                            "success": False,
                            "error": error_msg[:500],  # Truncate error
                        },
                        timeout=10,
                    )
                except Exception as e:
                    print(f"[Modal] Callback failed: {e}")
            
            return {"success": False, "error": error_msg}
        
        print("[Modal] Render complete, uploading to S3...")
        
        # Upload to S3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
            region_name=os.environ.get("AWS_REGION", "us-east-1"),
        )
        
        bucket_name = os.environ.get("AWS_S3_BUCKET", "flowcut-videos")
        s3_key = f"renders/{job_id}.mp4"
        
        try:
            s3_client.upload_file(
                output_path,
                bucket_name,
                s3_key,
                ExtraArgs={"ContentType": "video/mp4"},
            )
            print(f"[Modal] Uploaded to s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"[Modal] S3 upload failed: {e}")
            
            if callback_url:
                try:
                    requests.post(
                        callback_url,
                        json={
                            "jobId": job_id,
                            "success": False,
                            "error": f"S3 upload failed: {str(e)}",
                        },
                        timeout=10,
                    )
                except Exception:
                    pass
            
            return {"success": False, "error": f"S3 upload failed: {str(e)}"}
        
        # Call callback with success
        if callback_url:
            try:
                requests.post(
                    callback_url,
                    json={
                        "jobId": job_id,
                        "success": True,
                        "s3Key": s3_key,
                        "bucket": bucket_name,
                    },
                    timeout=10,
                )
                print("[Modal] Callback sent successfully")
            except Exception as e:
                print(f"[Modal] Callback failed: {e}")
        
        return {
            "success": True,
            "s3Key": s3_key,
            "bucket": bucket_name,
        }


@app.local_entrypoint()
def main(
    job_id: str = "test-job",
    template_id: str = "template1",
):
    """Local entrypoint for testing the render function."""
    result = render_video.remote(
        job_id=job_id,
        template_id=template_id,
        duration=150,  # 5 seconds at 30fps
        props={
            "recipientName": "Test User",
            "phoneName": "Test Phone",
        },
        width=1080,
        height=1920,
        fps=30,
    )
    print(f"Result: {result}")
