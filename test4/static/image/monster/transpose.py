import numpy as np
import cv2

path = "boss1.png"
image = cv2.imread(path)
image = image[:,::-1]
cv2.imwrite(path[:-5]+'2.png',image.astype('uint8'))
