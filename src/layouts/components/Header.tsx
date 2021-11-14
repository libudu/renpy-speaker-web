import { PageHeader, Tabs } from 'antd';

const Header: React.FC = () => {
  const menuItems = [
    {
      name: '配置角色',
    },
    {
      name: '查看对话',
    },
    {
      name: '生成配音',
    },
  ]
  return (
    <PageHeader
      className="bg-gray-50"
      style={{ boxShadow: '0 0 8px #aaa' }}
      title="Renpy-Speaker"
      extra={
        <Tabs
          tabBarStyle={{ marginBottom: 0 }}
          defaultActiveKey={menuItems[0].name}
        >
          {
            menuItems.map(({ name }) => (<Tabs.TabPane className="text-base" tab={name} key={name} />))
          }
        </Tabs>
      }
    />
  );
};

export default Header;