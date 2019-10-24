import cv2
import numpy as np

path = "chongjibo.jpeg"
image = cv2.imread(path)
B,G,R = cv2.split(image)
_,b = cv2.threshold(B,150,1,cv2.THRESH_BINARY)
_,g = cv2.threshold(G,150,1,cv2.THRESH_BINARY)
_,r = cv2.threshold(R,150,1,cv2.THRESH_BINARY)
new_image = np.ones((B.shape),dtype=B.dtype)*255
print(b)
B = B*b
G = G*g
R = R*r
new_image[:,:] = 250
new_image = new_image*b
image = cv2.merge((B,G,R,new_image))
cv2.imwrite('attackright.png',image.astype('uint8'))
