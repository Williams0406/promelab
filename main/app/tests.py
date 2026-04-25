from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient


User = get_user_model()


@override_settings(ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"])
class LoginIdentifierTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = "Admin12345!"
        self.user = User.objects.create_user(
            username="admin",
            email="admin@castromonte.com",
            password=self.password,
            first_name="Admin",
            last_name="Principal",
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True,
        )

    def test_login_accepts_username_in_identifier(self):
        response = self.client.post(
            "/api/auth/login/",
            {"identifier": "admin", "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_login_accepts_email_in_identifier(self):
        response = self.client.post(
            "/api/auth/login/",
            {"identifier": "admin@castromonte.com", "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)
