'use client';

import Link from 'next/link';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import '../../styles/register.css';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { handleRegister } from '@/redux/slices/authSlice';

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const { Title, Paragraph } = Typography;

export default function RegisterForm() {
     const dispatch = useAppDispatch();
    const router = useRouter();
  const [form] = Form.useForm<RegisterFormValues>();
  const [messageApi, contextHolder] = message.useMessage();


   const onFinish = async (values: RegisterFormValues) => {
    try {
       await dispatch(
        handleRegister({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
        })
      ).unwrap();
  
       messageApi.success(`Đăng ký thành công: ${values.email}`);
       form.resetFields();
      router.push('/');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        messageApi.error(String((error as { message: unknown }).message) || 'Đăng ký thất bại');
      } else {
        messageApi.error('Đăng ký thất bại');
      }
    }
  };

  return (
    <>
      {contextHolder}

      <main className="auth-page">
        <section className="auth-left">
          <p className="auth-tag">Create account</p>
          <h1 className="auth-brand">Portfolio CMS</h1>
          <p className="auth-description">
            Tạo tài khoản để bắt đầu quản lý nội dung cá nhân, project và bài viết trong hệ thống.
          </p>

          <div className="auth-note-box">
            <span className="auth-badge">User register</span>
            <p>
              Theo hướng kiến trúc bạn đang làm, route public register nên dành cho user thường; admin có thể tạo theo flow riêng. 
            </p>
          </div>
        </section>

        <section className="auth-right">
          <Card className="auth-card" bordered={false}>
            <div className="auth-card-header">
              <p className="auth-form-tag">Register</p>
              <Title level={2} className="auth-title">
                Đăng ký
              </Title>
              <Paragraph className="auth-subtitle">
                Điền thông tin cơ bản để tạo tài khoản mới.
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
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Tài Võ Tấn" className="auth-input" />
              </Form.Item>

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
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" className="auth-input" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" className="auth-input" />
              </Form.Item>

              <Form.Item className="auth-submit-wrap">
                <Button type="primary" htmlType="submit" block className="auth-submit">
                  Tạo tài khoản
                </Button>
              </Form.Item>

              <Paragraph className="auth-bottom-text">
                Đã có tài khoản?{' '}
                <Link href="/login" className="auth-inline-link">
                  Đăng nhập
                </Link>
              </Paragraph>
            </Form>
          </Card>
        </section>
      </main>
    </>
  );
}