from django.utils.deprecation import MiddlewareMixin
import re
import datetime
from PIL import Image

class Imagemiddleware(MiddlewareMixin):

    def process_request(self,request):
        image_patter = re.compile("background")
        print(request.path)
        if(image_patter.search(request.path)):
            if(request.COOKIE.get("background")==""):
                self.image = get_image(request.path)

    def process_response(self,request,response):
        current_date = datetime.datetime.now()
        current_date += datetime.timedelta(weeks=7)
        response.set_cookie("background", self.image, expires=current_date)
        return request.COOKIE.get("background")

    def get_image(self,path):
        dir_path = "/root/桌面/test4"
        path = os.path.join(dir_path,path)
        return Image.open(path)
