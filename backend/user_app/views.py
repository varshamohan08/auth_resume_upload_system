from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from user_app.models import UserDocs
from .serializers import UserSerializer
from rest_framework.parsers import JSONParser



# Create your views here.
class userLogin(APIView):
    def post(self, request):
        try:
            username = request.data.get('email', None)
            password = request.data.get('password', None)
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                user_details = {
                    'username': user.username,
                    'email': user.email
                }
                return Response({'detail': 'Success', 'access_token': access_token, 'userdetails': user_details}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

      
class userLogout(APIView):
    def get(self, request):
        logout(request)
        return Response({'detail': 'Success'}, status=status.HTTP_200_OK)
    

class userSignUp(APIView):

    def post(self, request):
        try:
            # import pdb;pdb.set_trace()
            with transaction.atomic():
                user_serializer = UserSerializer(data=request.data)
                
                if user_serializer.is_valid():
                    username = request.data.get('email')
                    user = User.objects.create_user(
                        username=username,
                        email=request.data.get('email'),
                        password=request.data.get('password'),
                        first_name=request.data.get('first_name'),
                        last_name=request.data.get('last_name')
                    )

                    login(request, user)
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    user_details = {
                        'username': user.username,
                        'email': user.email
                    }
                    return Response({'detail': 'Success', 'access_token': access_token, 'userdetails': user_details}, status=status.HTTP_200_OK)
                return Response({'detail': 'Failure', 'msg': user_serializer.errors}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class userApi(APIView):

    def get(self, request):
        try:
            user_instance = User.objects.filter(id=request.user.id).values().first()
            try:
                user_docs = UserDocs.objects.filter(user=request.user).values('doc_name', 'created_date').last()
            except UserDocs.DoesNotExist:
                user_docs = None
            return Response({'user': user_instance, 'resume': user_docs}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):

        current_password = request.data['current_password']
        new_password = request.data['new_password']

        user = request.user
        if user.check_password(current_password):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

class UserDocsAPI(APIView):
    def put(self, request):
        try:
            if 'resume' in request.FILES:
                resume_file = request.FILES['resume']
                doc_instance, created = UserDocs.objects.get_or_create(user=request.user)
                doc_instance.resume = resume_file
                doc_instance.doc_name = resume_file.name
                doc_instance.save()
                return Response({'detail': "Success"}, status=status.HTTP_200_OK)
            return Response({'detail': "Failed"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request):
        try:
            UserDocs.objects.filter(user = request.user).delete()

            return Response({'detail': "Success"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
