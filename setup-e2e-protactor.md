#---- Install Selenium Deps
--apt-get install libgconf2-dev -y
apt-get install libnss3-dev
#---- Install Java
add-apt-repository ppa:webupd8team/java
apt-get install oracle-java8-installer -y
export JAVA_HOME="/usr/bin/java"
#---- Install Chrome
apt-get install libxss1 libappindicator1 libindicator7
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome*.deb
apt-get install -f
#---- Install Protractor
npm install -g protractor
#--- Update and test webdriver manager
webdriver-manager update
webdriver-manager start
