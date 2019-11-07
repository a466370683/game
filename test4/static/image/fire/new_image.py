import cv2
import numpy as np

path = "level_fire_5.png"
image = cv2.imread(path,0)
image_new = cv2.imread(path)

def get_threshold(image):
	#二值化80-100范围内为1
    _,img = cv2.threshold(image,100,255,cv2.THRESH_TOZERO_INV)
    _,image = cv2.threshold(img,80,1,cv2.THRESH_BINARY_INV)
    k_filter = np.ones((2,2))
    image = cv2.morphologyEx(image,cv2.MORPH_OPEN,k_filter)
    return image

def show_image(image):
    cv2.imshow("test",image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def get_contours(image,image_new):
    contours,h = cv2.findContours(image,0,1)
    need_list = []
    num = 0
    element = cv2.getStructuringElement(cv2.MORPH_RECT,(9,9))
    for contour in contours:
        img = np.zeros(image.shape)
        area = cv2.contourArea(contour)
        
        if(area>200):
            num += 1
            contour = cv2.convexHull(contour)
            cv2.fillConvexPoly(img,contour,color=1)
            result = get_image_new(img,image_new)
            eps = 1e-3*cv2.arcLength(contour,True)
            approx = cv2.approxPolyDP(contour,eps,True)
            rect = cv2.minAreaRect(approx)
            box = cv2.boxPoints(rect)
            box = np.int0(box)
            need = {"width":np.abs(box[0][0]-box[2][0]),"height":np.abs(box[0][1]-box[2][1]),'x':(box[0][0]+box[2][0])/2,'y':(box[0][1]+box[2][1])/2}
            result_image = result[int(need['y']-need['height']):int(need['y']+need['height']),int(need['x']-need['width']):int(need['x']+need['width'])]
            cv2.imwrite("image"+str(num)+'.png',result)

    return need_list

def get_image_new(img,image_new,path):
    B,G,R = cv2.split(image_new)
    im = np.zeros(B.shape)
    new = np.ones((B.shape),dtype=B.dtype)*255
	#因为有透明部位，所以需要加0图
    b = img*(B+im)
    g = img*(G+im)
    r = img*(R+im)
    new[:,:] = 250
	#透明维度
    new = new*img
    image = cv2.merge((b.astype(B.dtype),g.astype(B.dtype),r.astype(B.dtype),new.astype(B.dtype)))
    cv2.imwrite(path,image.astype(np.uint8))
    

image = get_threshold(image)
get_image_new(image,image_new,path)
#show_image(image)
