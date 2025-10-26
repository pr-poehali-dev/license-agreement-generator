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
        
        # Decode if base64
        if is_base64:
            body_bytes = base64.b64decode(body)
        else:
            body_bytes = body.encode('latin-1') if isinstance(body, str) else body
        
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
        
        # Find file content
        parts = body_bytes.split(boundary_bytes)
        
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
        
        # Save template file
        template_path = '/tmp/template.docx'
        with open(template_path, 'wb') as f:
            f.write(file_data)
        
        # Copy to generate-contract function directory
        contract_template_path = os.path.join(
            os.path.dirname(__file__), 
            '..', 
            'generate-contract', 
            'template.docx'
        )
        
        # Create directory if not exists
        os.makedirs(os.path.dirname(contract_template_path), exist_ok=True)
        
        # Copy file
        with open(template_path, 'rb') as src:
            with open(contract_template_path, 'wb') as dst:
                dst.write(src.read())
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'message': 'Template uploaded successfully'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }