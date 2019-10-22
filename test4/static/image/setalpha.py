import cv2
import numpy as np

path = "timg1.png"
image = cv2.imread(path)
B,G,R = cv2.split(image)
_,b = cv2.threshold(B,200,1,cv2.THRESH_BINARY_INV)
_,g = cv2.threshold(G,200,1,cv2.THRESH_BINARY_INV)
_,r = cv2.threshold(R,200,1,cv2.THRESH_BINARY_INV)
new_image = np.ones((B.shape),dtype=B.dtype)*255
print(b)
B = B*b
G = G*g
R = R*r
new_image[:,:] = 100
image = cv2.merge((B,G,R,new_image))
cv2.imwrite('timg.png',image.astype('uint8')*5)
