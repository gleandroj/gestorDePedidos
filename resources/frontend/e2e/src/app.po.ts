import {browser, by, element} from 'protractor';
import BasePage from './base.po';

export class AppPage extends BasePage {

    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.className('mat-button-wrapper')).getText();
    }

    getBrowserLocation() {
        return browser.getCurrentUrl();
    }

    fillAndSubmitLoginForm(username, password) {
        const usernameElement = element(by.id('username'));
        const passwordElement = element(by.id('password'));
        usernameElement.clear();
        usernameElement.click();
        usernameElement.sendKeys(username);
        passwordElement.clear();
        passwordElement.click();
        passwordElement.sendKeys(password);
        return element(by.tagName('button')).submit();
    }

    getMatErrorText(index?) {
        index = index ? index : 0;
        return element.all(by.tagName('mat-error')).getText();
    }
}
