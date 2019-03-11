import {AppPage} from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should redirected to login page', () => {
        page.navigateTo();
        page.getBrowserLocation().then((url) => {
            expect(url).toContain('/#/auth/login');
        });
    });

    it('should see login button', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Acessar');
    });

    it('should see login error when username or password is invalid', () => {
        page.fillAndSubmitLoginForm('admin@sites.com.br', '123321').then(() => {
            expect(page.getSnackBarMessage()).toEqual('Ops! Usuário ou senha incorretos.');
        });
    });

    it('should login on application and be redirected to home page', () => {
        page.fillAndSubmitLoginForm('admin@sites.com.br', 'secret').then(() => {
            page.getBrowserLocation().then((url) => {
                expect(url).toContain('/sites/inicio');
            });
        });
    });
});
