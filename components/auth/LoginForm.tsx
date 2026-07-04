"use client";

import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { handleLogin } from "../../redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

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
        }),
      ).unwrap();

      messageApi.success(`Đăng nhập thành công: ${data.user.fullName}`);
      form.resetFields(["password"]);
      router.push("/");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        messageApi.error(
          String((error as { message: unknown }).message) ||
            "Đăng nhập thất bại",
        );
      } else {
        messageApi.error("Đăng nhập thất bại");
      }
    }
  };

  return (
    <>
      {contextHolder}

      <main className="grid min-h-screen items-center gap-10 overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-6 py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,460px)] lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_26%)]" />

        <section className="relative z-10 px-1 text-slate-900 lg:px-6">
          <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 backdrop-blur">
            Community account
          </p>

          <h1 className="mb-4 max-w-[9ch] text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[1.02] text-slate-900">
            Join the conversation.
          </h1>

          <p className="max-w-[560px] text-base leading-8 text-slate-600">
            Đăng nhập để bình luận và tương tác trong portfolio. Tài khoản này
            không có quyền tạo, chỉnh sửa hoặc quản lý bài viết trong CMS.
          </p>

          <div className="mt-10 grid max-w-[560px] gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Projects
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">12+</p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Posts
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Studio Flow
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">Smooth</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 flex justify-center">
          <Card
            variant="borderless"
            className="w-full rounded-[24px] border border-white/80 bg-white/92 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur"
            styles={{ body: { padding: 32 } }}
          >
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Welcome back
              </p>
              <Title level={2} className="!mb-2 !text-slate-900">
                Đăng nhập
              </Title>
              <Paragraph className="!mb-0 !text-base !leading-7 !text-slate-600">
                Đăng nhập để tham gia bình luận trong portfolio.
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
                label={
                  <span className="font-medium text-slate-700">Email</span>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  placeholder="tai@example.com"
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !text-slate-900 placeholder:!text-slate-400 hover:!border-blue-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-slate-700">Mật khẩu</span>
                }
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !text-slate-900 placeholder:!text-slate-400 hover:!border-blue-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
              </Form.Item>

              <div className="mb-6 flex items-center justify-between gap-4">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-slate-700">
                    Ghi nhớ đăng nhập
                  </Checkbox>
                </Form.Item>

                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 no-underline hover:text-blue-700"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="!h-12 !rounded-2xl !border-none !bg-blue-600 !font-bold !text-white !shadow-[0_10px_24px_rgba(37,99,235,0.22)] hover:!bg-blue-700 hover:!text-white"
                >
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
