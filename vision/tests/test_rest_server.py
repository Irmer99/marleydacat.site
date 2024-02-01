import unittest
import requests

class TestCatClassifierRestServer(unittest.TestCase):

    def test_happy(self):
        '''
        The happy path for this API is when a user uploads
        an image (.png/.jpg/.jpeg), they receive a 200 response
        with a response body that is either
            1) '{"is_cat": true}' if the image uploaded has a cat in it
            2) '{"is_cat": false}' if the image uploaded doesn't have a cat in it
        '''
        response = requests.post('http://127.0.0.1:8003/cat_classify', files={'image': open('marley.jpeg', 'rb')})
        assert response.status_code == 200
        print(response.json())
        