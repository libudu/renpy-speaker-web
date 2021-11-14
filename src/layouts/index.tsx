import Header from './components/Header';
import { IRouteComponentProps, useModel } from 'umi';
import { Button } from 'antd';
import { useState } from 'react';

const Layout: React.FC<IRouteComponentProps> = ({ children, location }) => {
  const {
    rootDir,
    chooseRootDir,
    hasSelectDialogFile,
    chooseDialogueFile,
  } = useModel('configs');

  const [tmp, setTmp] = useState(false);

  if(!tmp) {
    return (
      <div>
        <div className="text-center">
          <div>1、该项目是调用的阿里云语音合成API，需要填写appId和token。</div>
          <div>现在内测阶段暂时用开发者的阿里云账号，但是token可能会过期或不稳定。</div>
        </div>
        <div className="flex justify-center">
          <Button className="mt-3" type="primary" size="large" onClick={() => setTmp(true)}>确定</Button>
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
      {/* <Header /> */}
      { children }
    </>
  )
};

export default Layout;