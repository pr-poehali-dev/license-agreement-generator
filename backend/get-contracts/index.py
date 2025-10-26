'''
Business: Get list of all generated contracts
Args: event with httpMethod GET
Returns: JSON array with contracts history
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration error'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT contract_number, nickname, full_name, short_name, contract_date, "
        "citizenship, email, passport, created_at "
        "FROM contracts ORDER BY created_at DESC"
    )
    
    rows = cur.fetchall()
    
    contracts = []
    for row in rows:
        contracts.append({
            'contractNumber': row[0],
            'nickname': row[1],
            'fullName': row[2],
            'shortName': row[3],
            'contractDate': row[4],
            'citizenship': row[5],
            'email': row[6],
            'passport': row[7],
            'createdAt': row[8].isoformat() if row[8] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(contracts),
        'isBase64Encoded': False
    }
