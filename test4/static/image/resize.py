import cv2
import numpy

path = "background1.jpg"
image = cv2.imread(path)
image = cv2.resize(image,(2300,1200))
cv2.imwrite(path,image)
