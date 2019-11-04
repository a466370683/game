import numpy as np
import cv2

path = "monster.jpg"
image = cv2.imread(path)
image = cv2.resize(image,(150,150))
img = image[20:130,20:140]
cv2.imwrite(path,img.astype(np.uint8))
