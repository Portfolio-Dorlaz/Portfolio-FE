'use client';

import { Button, Card, Checkbox, Form, Input, Typography, message } from 'antd';
import '../../styles/login.css';

const { Title, Paragraph } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: { email: string; password: string; remember?: boolean }) => {
    messageApi.success(`Đăng nhập thử thành công: ${values.email}`);
    form.resetFields(['password']);
  };

  return (
    <>
      {contextHolder}

      <main className="auth-page">
        <section className="auth-left">
          <p className="auth-tag">Portfolio CMS</p>
          <h1 className="auth-brand">Võ Tấn Tài</h1>
          <p className="auth-description">
            Quản lý portfolio, blog, project showcase và nội dung cá nhân trong một dashboard gọn gàng.
          </p>

          <div className="auth-note-box">
            <span className="auth-badge">Admin only</span>
            <p>
              Đây là khu vực đăng nhập quản trị, không phải trang public dành cho người xem portfolio.
            </p>
          </div>
        </section>

        <section className="auth-right">
          <Card className="auth-card" bordered={false}>
            <div className="auth-card-header">
              <p className="auth-form-tag">Welcome back</p>
              <Title level={2} className="auth-title">
                Đăng nhập
              </Title>
              <Paragraph className="auth-subtitle">
                Đăng nhập để quản lý bài viết, project và hệ thống portfolio của bạn.
              </Paragraph>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input placeholder="tai@example.com" className="auth-input" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" className="auth-input" />
              </Form.Item>

              <div className="auth-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>

                <a href="#" className="auth-forgot">
                  Quên mật khẩu?
                </a>
              </div>

              <Form.Item className="auth-submit-wrap">
                <Button type="primary" htmlType="submit" block className="auth-submit">
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </section>
      </main>
    </>
  );
}