import cv2
import numpy as np

path = "monster.jpg"
image = cv2.imread(path)
B,G,R = cv2.split(image)
_,b = cv2.threshold(B,10,1,cv2.THRESH_BINARY)
_,g = cv2.threshold(G,10,1,cv2.THRESH_BINARY)
_,r = cv2.threshold(R,10,1,cv2.THRESH_BINARY)
new_image = np.ones((B.shape),dtype=B.dtype)*255
print(b)
B = B*b
np.clip(B,0,1)
B = B
G = G*g
np.clip(G,0,0)
G = G
R = R*r
np.clip(R,0,0)
R = R
new_image[:,:] = 250
new_image = new_image*b
image = cv2.merge((B,G,R,new_image))
image = cv2.resize(image,(150,150))
cv2.imwrite(path[:-4]+'.png',image.astype('uint8'))
