'use client';

import { Button, Card, Checkbox, Form, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';
import { handleLogin } from '../../redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';

const { Title, Paragraph } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
  try {
    const data = await dispatch(
      handleLogin({
        email: values.email,
        password: values.password,
      })
    ).unwrap();

    messageApi.success(`Đăng nhập thành công: ${data.user.fullName}`);
    form.resetFields(['password']);
    router.push('/');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      messageApi.error(String((error as { message: unknown }).message) || 'Đăng nhập thất bại');
    } else {
      messageApi.error('Đăng nhập thất bại');
    }
  }
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

            <Form<LoginFormValues>
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
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </section>
      </main>
    </>
  );
}