'''
Business: Generate license agreement documents package from template
Args: event with httpMethod, body containing form data
Returns: ZIP archive with 5 DOCX files or error message
'''

import json
import io
import zipfile
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    contract_number = body_data.get('contractNumber', '')
    contract_date = body_data.get('contractDate', '')
    citizenship = body_data.get('citizenship', '')
    full_name = body_data.get('fullName', '')
    short_name = body_data.get('shortName', '')
    nickname = body_data.get('nickname', '')
    passport = body_data.get('passport', '')
    email = body_data.get('email', '')
    
    if not all([contract_number, contract_date, citizenship, full_name, short_name, nickname, passport, email]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'All fields are required'}),
            'isBase64Encoded': False
        }
    
    template_url = 'https://disk.yandex.ru/d/iXT9pWLUhONW3A'
    
    direct_download_url = get_direct_download_link(template_url)
    
    template_response = urllib.request.urlopen(direct_download_url)
    template_bytes = template_response.read()
    
    from docx import Document
    
    replacements = {
        '{{номер_договора}}': contract_number,
        '{{дата_заключения_договора}}': contract_date,
        '{{graj}}': citizenship,
        '{{ФИО_ИП_полностью_кого}}': full_name,
        '{{ФИО_ИП_кратко}}': short_name,
        '{{NIK}}': nickname,
        '{{PAS}}': passport,
        '{{mail}}': email
    }
    
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        doc_names = [
            f'Договор_{contract_number.replace("/", "-")}.docx',
            f'Приложение_1_{contract_number.replace("/", "-")}.docx',
            f'Приложение_2_{contract_number.replace("/", "-")}.docx',
            f'Приложение_3_{contract_number.replace("/", "-")}.docx',
            f'Акт_{contract_number.replace("/", "-")}.docx'
        ]
        
        for doc_name in doc_names:
            doc = Document(io.BytesIO(template_bytes))
            
            for paragraph in doc.paragraphs:
                for key, value in replacements.items():
                    if key in paragraph.text:
                        paragraph.text = paragraph.text.replace(key, value)
            
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        for paragraph in cell.paragraphs:
                            for key, value in replacements.items():
                                if key in paragraph.text:
                                    paragraph.text = paragraph.text.replace(key, value)
            
            doc_buffer = io.BytesIO()
            doc.save(doc_buffer)
            doc_buffer.seek(0)
            
            zip_file.writestr(doc_name, doc_buffer.read())
    
    zip_buffer.seek(0)
    import base64
    zip_base64 = base64.b64encode(zip_buffer.read()).decode('utf-8')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/zip',
            'Content-Disposition': f'attachment; filename="Договор_пакет_{contract_number.replace("/", "-")}.zip"',
            'Access-Control-Allow-Origin': '*'
        },
        'body': zip_base64,
        'isBase64Encoded': True
    }

def get_direct_download_link(public_url: str) -> str:
    api_url = 'https://cloud-api.yandex.net/v1/disk/public/resources/download'
    params = {'public_key': public_url}
    
    import urllib.parse
    query_string = urllib.parse.urlencode(params)
    full_url = f'{api_url}?{query_string}'
    
    response = urllib.request.urlopen(full_url)
    data = json.loads(response.read().decode('utf-8'))
    
    return data['href']