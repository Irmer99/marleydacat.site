import os
import pymysql

from src.dependencies import db_config
from src.user_routes import hash_password

def create_test_user():
    username = "test"
    password = "password"
    with pymysql.connect(**db_config) as sql_client:
        with sql_client.cursor() as cur:
            cur.execute("""
                INSERT IGNORE INTO users (username, email, password)
                    VALUES (%s, 'test@test.test', %s)
            """, (username, hash_password(password)))
    return username, password

def clear_posts():
    with pymysql.connect(**db_config) as sql_client:
        with sql_client.cursor() as cur:
            cur.execute("DELETE FROM posts")
            cur.execute("DELETE FROM likes")
    for filename in os.listdir('image_storage'):
        os.remove(f'image_storage/{filename}')