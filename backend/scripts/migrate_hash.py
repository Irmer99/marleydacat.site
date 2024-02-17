import pymysql
import copy

from src.user_routes import hash_password
from src.dependencies import db_config

if __name__ == '__main__':
    with pymysql.connect(**db_config) as sql_client:
        with sql_client.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT username, password FROM users")
            users = cur.fetchall()

            for user in users:
                print(user)
                new_password = hash_password(user["password"])
                print(f'Old pass: {user["password"]}, New pass: {new_password}')
                cur.execute("UPDATE users SET password=%s WHERE username=%s", (new_password, user["username"]))
    print("Done :)")