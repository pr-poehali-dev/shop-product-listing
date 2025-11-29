'''
Business: Get all product categories with product counts
Args: event - dict with httpMethod
Returns: HTTP response with categories list
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
            'body': ''
        }
    
    if method == 'GET':
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        try:
            cur.execute("""
                SELECT c.id, c.name, c.slug, c.icon_name, c.product_count,
                       COUNT(p.id) as actual_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                GROUP BY c.id, c.name, c.slug, c.icon_name, c.product_count
                ORDER BY c.id
            """)
            
            rows = cur.fetchall()
            categories = []
            for row in rows:
                categories.append({
                    'id': row[0],
                    'name': row[1],
                    'slug': row[2],
                    'icon_name': row[3],
                    'product_count': row[4],
                    'actual_count': row[5]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(categories)
            }
        
        finally:
            cur.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
