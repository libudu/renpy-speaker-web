import { Dialog, DownloadErrorInfo, makeDialogFile } from '@/utils/speakerFile';
import { Modal, Button, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DownloadModal: React.FC<{
  visiable: boolean;
  concurrency: number;
  isTryMake: boolean;
  onCancle: () => void;
}> = ({ visiable, onCancle, concurrency, isTryMake }) => {

  const { rootDir, characterList, dialogList } = useModel('configs');
  const targetDialogList = isTryMake ?  dialogList.slice(0, 10) : dialogList;

  // 下载状态
  const [isError, setIsError] = useState(false);
  
  // 成功和失败信息
  const [successList, setSuccessList] = useState<Dialog[]>([]);
  const [errorList, setErrorList] = useState<DownloadErrorInfo[]>([]);

  useEffect(() => {
    const { stopDownloading } = makeDialogFile({
      rootDir: rootDir as any,
      characterList,
      dialogList: targetDialogList,
      concurrency,
      onError: (errorInfo) => {
        errorList.push(errorInfo);
        setErrorList([...errorList]);
        // 错误太多，需要停止下载，并在模态框展示
        if(errorList.length > 5) {
          stopDownloading();
          setIsError(true);
        }
      },
      onSuccess: (successDialog) => {
        console.log('获取成功！')
        successList.push(successDialog);
        setSuccessList([...successList]);
      },
    });
  }, []);

  // 结束意味着出错或下载完成
  const isSuccess = (successList.length + errorList.length) >= targetDialogList.length
  const isFinished = isError || isSuccess;

  return (
    <Modal
      width={1000}
      visible={visiable}
      closable={false}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <div>总对话：{targetDialogList.length}</div>
      <div>成功：{successList.length}</div>
      <div>失败：{errorList.length}</div>
      {
        isError &&
        <div>
          <div>下载中错误超过5个，请检查配置后重新尝试下载！</div>
          <div>错误信息：</div>
          <div>
            {
              errorList.map(({dialog, error }) => {
                return (
                  <Alert
                    type="error"
                    className="mb-2"
                    message={
                      <div>
                        <div>标签: {dialog.label}</div>
                        <div>文本: {dialog.text}</div>
                        <div>原因: {error}</div>
                      </div>
                    }
                  />
                )
              })
            }
          </div>
        </div>
      }
      {
        isSuccess &&
        <Alert
          className="my-4"
          type="success"
          message={`下载成功，请检查选择的 ${rootDir?.getDirName()} 目录下的配音文件！`}
        />
      }
      <div className="flex justify-center">
        <Button
          type="primary"
          size="large"
          loading={!isFinished}
          onClick={() => {
            if(isFinished) {
              onCancle();
            }
          }}
        >
          { isFinished ? '确定' : '下载中' }
        </Button>
      </div>
    </Modal>
  );
};

export default DownloadModal;