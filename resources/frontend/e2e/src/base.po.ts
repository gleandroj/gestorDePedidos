import {browser, by, element, ExpectedConditions as ec} from 'protractor';

export default class BasePage {
    waitForSnackBar() {
        return browser
            .wait(ec.presenceOf(element(by.css('.mat-simple-snackbar'))), 2000, 'not found')
            .then(() => element(by.css('.mat-simple-snackbar')));
    }

    getSnackBarMessage() {
        return this.waitForSnackBar().then((el) => el.getText());
    }
}
