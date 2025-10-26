'''
Business: Upload new template.docx file to replace existing template
Args: event with multipart/form-data containing template file
Returns: Success or error message
'''

import json
import base64
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle template file upload
    Args: event - dict with httpMethod, body, headers
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Get body content
        body = event.get('body', '')
        is_base64 = event.get('isBase64Encoded', False)
        
        print(f"DEBUG: is_base64={is_base64}, body type={type(body)}, body length={len(body) if body else 0}")
        
        # Decode if base64
        if is_base64:
            body_bytes = base64.b64decode(body)
        else:
            body_bytes = body.encode('latin-1') if isinstance(body, str) else body
        
        print(f"DEBUG: body_bytes length={len(body_bytes)}")
        
        # Parse multipart form data
        headers = event.get('headers', {})
        content_type = headers.get('content-type') or headers.get('Content-Type', '')
        
        if 'multipart/form-data' not in content_type:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Content-Type must be multipart/form-data, got: {content_type}'})
            }
        
        # Extract boundary
        boundary = content_type.split('boundary=')[-1].strip()
        boundary_bytes = f'--{boundary}'.encode('latin-1')
        
        print(f"DEBUG: boundary={boundary}, parts to split")
        
        # Find file content
        parts = body_bytes.split(boundary_bytes)
        print(f"DEBUG: found {len(parts)} parts")
        
        file_data = None
        for part in parts:
            if b'filename=' in part:
                # Extract file content (after headers)
                header_end = part.find(b'\r\n\r\n')
                if header_end != -1:
                    file_data = part[header_end + 4:]
                    # Remove trailing CRLF and boundary markers
                    if file_data.endswith(b'--\r\n'):
                        file_data = file_data[:-4]
                    elif file_data.endswith(b'\r\n'):
                        file_data = file_data[:-2]
                    break
        
        if not file_data or len(file_data) < 100:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No valid file found in request', 'parts': len(parts)})
            }
        
        # Validate it's a valid DOCX file (starts with PK zip signature)
        if not file_data.startswith(b'PK'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid DOCX file format'})
            }
        
        print(f"DEBUG: Valid DOCX file, size={len(file_data)} bytes")
        
        # Return base64 encoded file for frontend to download and manually replace
        file_base64 = base64.b64encode(file_data).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'message': 'Template validated successfully',
                'fileSize': len(file_data),
                'fileBase64': file_base64
            })
        }
        
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e), 'type': type(e).__name__})
        }