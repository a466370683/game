import cv2
import numpy as np

def get_new_image(path):
	image = cv2.imread(path)
	B,G,R = cv2.split(image)
	_,b = cv2.threshold(B,120,1,cv2.THRESH_BINARY_INV)
	_,g = cv2.threshold(G,120,1,cv2.THRESH_BINARY_INV)
	_,r = cv2.threshold(R,120,1,cv2.THRESH_BINARY_INV)
	new_image = np.ones((B.shape),dtype=B.dtype)*255
	print(b)
	B = B*b
	G = G*g
	R = R*r
	new_image[:,:] = 250
	new_image = new_image*b
	image = cv2.merge((B,G,R,new_image))
	new_path = path[:-5]+'.png'
	cv2.imwrite(new_path,image.astype('uint8'))

path_list = ["timg.jpeg"]
for path in path_list:
	get_new_image(path)

