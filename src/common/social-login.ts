/**
 * note that redirect_uri doesn't have any meaning here as we close the login window
 */

enum LoginType {
  GITHUB = 'GITHUB',
  WEIBO = 'WEIBO',
}

export interface LoginOption {
  tokenExchangeUrl: string
  endpoint: string
  params: {
    client_id: string,
    redirect_uri: string,
    [index: string]: string
  }
  url: string
  windowSize?: {
    width: number,
    height: number,
  }
}

const githubOption: LoginOption = {
  tokenExchangeUrl: 'https://a3eks8ljq9.execute-api.ap-east-1.amazonaws.com/prod/auth/github',
  endpoint: 'https://github.com/login/oauth/authorize',
  params: {
    client_id: 'd0812cce061bc8601159',
    redirect_uri: 'http://localhost:3000/github/login_success',
    scope: 'user',
  },
  get url() {
    const query_str = Object.entries(this.params)
      .map(([key, value]) => {
        return key + '=' + encodeURIComponent(value);
      }).join('&');
    return this.endpoint + '?' + query_str;
  },
  windowSize: {
    height: 752,
    width: Math.ceil(1.3 * 752)
  },
};

const weiboOption: LoginOption = {
  tokenExchangeUrl: 'https://a3eks8ljq9.execute-api.ap-east-1.amazonaws.com/prod/auth/weibo',
  endpoint: 'https://api.weibo.com/oauth2/authorize',
  params: {
    client_id: '1963552182',
    redirect_uri: 'http://x.com/weibo/login_success',
    response_type: 'code',
  },
  get url() {
    const query_str = Object.entries(this.params)
      .map(([key, value]) => {
        return key + '=' + encodeURIComponent(value);
      }).join('&');
    return this.endpoint + '?' + query_str;
  },
  // windowSize: {},
};

function getLoginType(url: string): LoginType | null {
  if (url.includes('github')) return LoginType.GITHUB;
  if (url.includes('weibo')) return LoginType.WEIBO;
  return null
}

function getLoginOption(loginType: LoginType) {
  switch (loginType) {
    case LoginType.GITHUB:
      return githubOption;
    case LoginType.WEIBO:
      return weiboOption;
  }
}

function extractCode(url: string): string | null {
  const raw_code = /code=([^&]*)/.exec(url) || null;
  return (raw_code && raw_code.length > 1) ? raw_code[1] : null;
}

export {
  githubOption,
  weiboOption,
  getLoginType,
  getLoginOption,
  extractCode,
}
