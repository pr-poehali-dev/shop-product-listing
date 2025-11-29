'''
Business: CRUD operations for products - list, create, update, get by ID
Args: event - dict with httpMethod, queryStringParameters, body
Returns: HTTP response with products data or success/error messages
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category_id = params.get('category_id')
            product_id = params.get('id')
            
            if product_id:
                cur.execute("""
                    SELECT p.id, p.name, p.article, p.description, p.price, p.discount, 
                           p.image_url, p.category_id, p.stock, c.name as category_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.id = %s
                """, (product_id,))
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Product not found'})
                    }
                product = {
                    'id': row[0], 'name': row[1], 'article': row[2], 'description': row[3],
                    'price': float(row[4]), 'discount': float(row[5] or 0), 'image_url': row[6],
                    'category_id': row[7], 'stock': row[8], 'category_name': row[9]
                }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(product)
                }
            
            if category_id:
                cur.execute("""
                    SELECT p.id, p.name, p.article, p.description, p.price, p.discount, 
                           p.image_url, p.category_id, p.stock, c.name as category_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.category_id = %s
                    ORDER BY p.created_at DESC
                """, (category_id,))
            else:
                cur.execute("""
                    SELECT p.id, p.name, p.article, p.description, p.price, p.discount, 
                           p.image_url, p.category_id, p.stock, c.name as category_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    ORDER BY p.created_at DESC
                """)
            
            rows = cur.fetchall()
            products = []
            for row in rows:
                products.append({
                    'id': row[0], 'name': row[1], 'article': row[2], 'description': row[3],
                    'price': float(row[4]), 'discount': float(row[5] or 0), 'image_url': row[6],
                    'category_id': row[7], 'stock': row[8], 'category_name': row[9]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(products)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name', '').strip()
            article = body_data.get('article', '').strip()
            description = body_data.get('description', '')
            price = body_data.get('price', 0)
            discount = body_data.get('discount', 0)
            image_url = body_data.get('image_url', '')
            category_id = body_data.get('category_id')
            stock = body_data.get('stock', 0)
            
            if not name or not article or price <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Name, article and valid price required'})
                }
            
            cur.execute("""
                INSERT INTO products (name, article, description, price, discount, image_url, category_id, stock)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, article, price, discount, image_url, category_id, stock
            """, (name, article, description, price, discount, image_url, category_id, stock))
            
            row = cur.fetchone()
            conn.commit()
            
            product = {
                'id': row[0], 'name': row[1], 'article': row[2], 'price': float(row[3]),
                'discount': float(row[4] or 0), 'image_url': row[5], 'category_id': row[6], 'stock': row[7]
            }
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(product)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product ID required'})
                }
            
            updates = []
            params = []
            
            for field in ['name', 'article', 'description', 'price', 'discount', 'image_url', 'category_id', 'stock']:
                if field in body_data:
                    updates.append(f"{field} = %s")
                    params.append(body_data[field])
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            params.append(product_id)
            query = f"UPDATE products SET {', '.join(updates)} WHERE id = %s RETURNING id"
            cur.execute(query, params)
            
            if cur.fetchone():
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': product_id})
                }
            
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Product not found'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
