import { IRouteComponentProps, useModel } from 'umi';
import { Button, Input, message } from 'antd';
import { useState } from 'react';
import { appConfig, DEVELOPER_CONFIG, fetchTextVoice } from '@/utils/aliyunTts';

const Layout: React.FC<IRouteComponentProps> = ({ children, location }) => {
  const {
    rootDir,
    chooseRootDir,
    hasSelectDialogFile,
    chooseDialogueFile,
  } = useModel('configs');

  const [appkey, setAppkey] = useState('');
  const [token, setToken] = useState('');
  const [tmp, setTmp] = useState(false);
  

  if(!tmp) {
    return (
      <div>
        <div className="flex flex-col items-center">
          <div>1、该项目是调用的阿里云语音合成API，需要填写AppKey和AccessToken。</div>
          <div>现在内测阶段暂时用开发者的阿里云账号，但是token可能会过期或不稳定。</div>
          <div>可以联系开发者QQ 3127966867</div>
          <Input
            className="my-2"
            style={{ width: 400 }}
            placeholder="阿里云语音合成项目Appkey"
            value={appkey}
            onChange={(e) => setAppkey(e.target.value)}
            />
          <Input
            style={{ width: 400 }}
            placeholder="阿里云语音合成AccessToken"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <div className="mt-3 flex justify-center">
          <Button
            type="primary"
            size="large"
            onClick={async () => {
              appConfig.appkey = appkey;
              appConfig.token = token;
              const { success, data } = await fetchTextVoice({ text: '测试', voiceId: 'xiaoyun' });
              if(success) {
                setTmp(true);
              } else {
                message.error('appkey或token出错，错误原因：' + data);
              }
            }}
          >
            确定
          </Button>
          <Button
            className="ml-4"
            size="large"
            onClick={() => {
              setAppkey(DEVELOPER_CONFIG.appkey);
              setToken(DEVELOPER_CONFIG.token);
            }}
          >
            使用开发者的临时账号(可能过期)
          </Button>
        </div>
      </div>
    );
  }

  if(!rootDir) {
    return (
      <div className="text-center">
        <div>2、请选择一个目录作为输出配音文件的目录<br />（后续将在该目录下生成大量文件，最好是空目录或已存在旧配音文件的目录）</div>
        <Button onClick={chooseRootDir}>选择目录</Button>
      </div>
    );
  }

  if(!hasSelectDialogFile) {
    return (
      <div className="text-center">
        <div>3.dialogue.tab文件</div>
        <div>在renpy引擎启动器中选择“导出对话”</div>
        <div>格式选择“以制表符分割的表格(dialogue.tab)”</div>
        <div>选项仅勾选“在对话中忽略文本标签”</div>
        <div>之后就能在renpy项目的根目录下生成dialogue.tab文件了</div>
        <Button onClick={chooseDialogueFile}>点击选择</Button>
      </div>
    );
  }

  return (
    <>
      { children }
    </>
  )
};

export default Layout;