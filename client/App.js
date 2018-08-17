import React, {Component} from 'react';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  AppProvider,
} from '@shopify/polaris';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const breadcrumbs = [{content: 'Hrv App'}, {content: 'Doke'}];

    return (
      <AppProvider>
        <Page
          title="Haravan App"
          breadcrumbs={breadcrumbs}
        >
          <Layout>
            <Layout.Section >
            <Card title="Hello to Doke App" sectioned>
              
            </Card>
            </Layout.Section>
            <Layout.Section>
              <FooterHelp>
                Developed By <Link url="https://doke.vn">DOKE.VN</Link>.
              </FooterHelp>
            </Layout.Section>
          </Layout>
        </Page>
      </AppProvider>
    );
  }
}

export default App;