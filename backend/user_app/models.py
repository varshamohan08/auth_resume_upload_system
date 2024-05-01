from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserDocs(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    doc_name = models.CharField(max_length=255, blank=True, null=True)
    resume = models.FileField(upload_to='resumes/')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username