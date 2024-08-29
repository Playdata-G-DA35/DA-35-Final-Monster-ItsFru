import boto3
from botocore.exceptions import ClientError
from core.config import settings

class S3Client:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME

    def upload_file(self, file_name, object_name=None):
        if object_name is None:
            object_name = file_name

        try:
            self.s3.upload_file(file_name, self.bucket_name, object_name)
        except ClientError as e:
            print(f"Error uploading file to S3: {e}")
            return False
        return True

    def download_file(self, object_name, file_name):
        try:
            self.s3.download_file(self.bucket_name, object_name, file_name)
        except ClientError as e:
            print(f"Error downloading file from S3: {e}")
            return False
        return True

    def get_object_url(self, object_name):
        try:
            url = self.s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=3600  # URL expires in 1 hour
            )
            return url
        except ClientError as e:
            print(f"Error generating pre-signed URL: {e}")
            return None
        
    def upload_file_to_s3(self, file_path, object_name, bucket=None):
        """
        S3에 파일을 업로드합니다.
        
        :param file_path: 업로드할 로컬 파일 경로
        :param object_name: S3에 저장될 객체 이름
        :param bucket: 대상 버킷 이름 (기본값은 self.bucket_name)
        :return: 성공 시 True, 실패 시 False
        """
        bucket = bucket or self.bucket_name
        try:
            self.s3.upload_file(file_path, bucket, object_name)
            return True
        except ClientError as e:
            print(f"Error uploading file to S3: {e}")
            return False
        
    def generate_presigned_url(self, object_name, expiration=3600, bucket=None):
        """
        S3 객체에 대한 미리 서명된 URL을 생성합니다.
        
        :param object_name: S3 객체 이름
        :param expiration: URL 만료 시간(초), 기본값 1시간
        :param bucket: 대상 버킷 이름 (기본값은 self.bucket_name)
        :return: 미리 서명된 URL 또는 None (실패 시)
        """
        bucket = bucket or self.bucket_name
        try:
            url = self.s3.generate_presigned_url('get_object',
                                                Params={'Bucket': bucket,
                                                        'Key': object_name},
                                                ExpiresIn=expiration)
            return url
        except ClientError as e:
            print(f"Error generating presigned URL: {e}")
            return None
        
    def delete_object(self, object_name, bucket=None):
        """
        S3에서 객체를 삭제합니다.
        
        :param object_name: 삭제할 S3 객체 이름
        :param bucket: 대상 버킷 이름 (기본값은 self.bucket_name)
        :return: 성공 시 True, 실패 시 False
        """
        bucket = bucket or self.bucket_name
        try:
            self.s3.delete_object(Bucket=bucket, Key=object_name)
            return True
        except ClientError as e:
            print(f"Error deleting object from S3: {e}")
            return False    
    
    def list_objects(self, prefix='', bucket=None):
        """
        S3 버킷 내 객체들을 나열합니다.
        
        :param prefix: 객체 접두사 (선택적)
        :param bucket: 대상 버킷 이름 (기본값은 self.bucket_name)
        :return: 객체 목록 또는 None (실패 시)
        """
        bucket = bucket or self.bucket_name
        try:
            response = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix)
            return response.get('Contents', [])
        except ClientError as e:
            print(f"Error listing objects in S3: {e}")
            return None

s3_client = S3Client()