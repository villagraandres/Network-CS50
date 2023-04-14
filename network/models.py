from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime
import pytz


class User(AbstractUser):
     following = models.ManyToManyField('self', related_name='followers', symmetrical=False,blank=True)



class Post(models.Model):
    user=models.ForeignKey(User,related_name="posts",on_delete=models.CASCADE);
    content=models.TextField();
    date =models.DateTimeField( default=pytz.timezone('UTC').localize(datetime.datetime.now()));
    likes=models.ManyToManyField(User,related_name="likes");

    def __str__(self):
        return f"Post of {self.user} in {self.date}"
    

