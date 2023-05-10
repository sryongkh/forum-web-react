from selenium import webdriver
import time
from selenium.webdriver.common.by import By

driver = webdriver.Chrome('src/chromedriver')

# Login
time.sleep(10)
driver.get('http://127.0.0.1:5173/login')

login_username = driver.find_element(By.ID, 'input-username')
login_password = driver.find_element(By.ID, 'input-password')
login_username.send_keys('wiladosry@gmail.com')
login_password.send_keys('password1234')

# time.sleep(10)
# # Profile
# driver.get('http://127.0.0.1:5173/profile')

# user_address = driver.find_element(By.ID, 'user-address')
# user_username = driver.find_element(By.ID, 'user-username')
# user_phone = driver.find_element(By.ID, 'user-phone')

# save_button = driver.find_element(By.ID, 'save-profile')

# user_address.send_keys('Chatuchak, 10900')
# user_username.send_keys('Cartoon')
# user_phone.send_keys('0999999999')
# save_button.click()

time.sleep(60)
