import { LedgerCpPage } from './app.po';

describe('ledger-cp App', function() {
  let page: LedgerCpPage;

  beforeEach(() => {
    page = new LedgerCpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
