import unittest
from unittest.mock import patch, MagicMock
from cat_classifier import DataLoader

class TestDataLoader(unittest.TestCase):

    @patch('transformers.ViTImageProcessor.from_pretrained')
    def test_dataloader_get_images(self, mock_from_pretrained):
        mock_from_pretrained.return_value = MagicMock()
        test_data_loader = DataLoader('tests/test_data')
        test_train_imgs = test_data_loader.get_training_images()
        # there should be 3 cat examples and 2 non-cat examples
        assert len(test_train_imgs) == 5
        # if we call the function again the order should be different
        test_train_imgs2 = test_data_loader.get_training_images()
        assert len(test_train_imgs) == len(test_train_imgs2)
        assert test_train_imgs != test_train_imgs2

    def test_dataloader_load_image_tensors(self):
        pass