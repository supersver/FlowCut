# Modal Rendering Setup

This directory contains the Modal serverless function for rendering Remotion videos.

## Prerequisites

1. **Install Modal CLI**:

   ```bash
   pip install modal
   ```

2. **Authenticate with Modal**:

   ```bash
   modal token set --token-id YOUR_TOKEN_ID --token-secret YOUR_TOKEN_SECRET
   ```

3. **Create AWS Secret in Modal**:
   ```bash
   modal secret create flowcut-aws \
     AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY \
     AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY \
     AWS_REGION=us-east-1 \
     AWS_S3_BUCKET=flowcut-renders
   ```

## Deployment

Deploy the Modal function:

```bash
modal deploy modal/modal_render.py
```

## Testing

Test the function locally:

```bash
modal run modal/modal_render.py
```

## Architecture

1. Frontend calls `POST /api/jobs` to create a render job
2. Backend enqueues the job and triggers Modal function
3. Modal bundles & renders the Remotion video
4. Modal uploads the MP4 to S3
5. Modal calls `/api/callback` with the S3 key
6. Frontend polls `GET /api/jobs/:id` for status
7. On completion, frontend downloads video via presigned URL
