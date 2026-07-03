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

      <main className="grid min-h-screen items-center gap-8 bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] px-8 py-8 [background-image:radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,#0f172a_0%,#020617_100%)] lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,460px)] max-[900px]:grid-cols-1 max-[900px]:px-5 max-[900px]:py-5">
        <section className="px-8 text-slate-200 max-[900px]:px-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-400">
            Portfolio CMS
          </p>
          <h1 className="mb-4 text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.05] text-slate-50">
            Võ Tấn Tài
          </h1>
          <p className="text-base leading-[1.7] text-slate-400">
            Quản lý portfolio, blog, project showcase và nội dung cá nhân trong
            một dashboard gọn gàng.
          </p>
        </section>

        <section className="flex justify-center">
          <Card
            variant="borderless"
            className="w-full rounded-[28px] border border-[rgba(148,163,184,0.12)] bg-[rgba(15,23,42,0.92)] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            styles={{ body: { padding: 32 } }}
          >
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-400">
                Welcome back
              </p>
              <Title level={2} className="!mb-3 !text-slate-50">
                Đăng nhập
              </Title>
              <Paragraph className="!mb-0 !text-base !leading-[1.7] !text-slate-400">
                Đăng nhập để quản lý bài viết, project và hệ thống portfolio của
                bạn.
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
                label={<span className="text-slate-300">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  placeholder="tai@example.com"
                  className="!rounded-2xl !border-[rgba(148,163,184,0.16)] !bg-[#0b1120] !px-3 !py-3 !text-slate-200 placeholder:!text-slate-500 hover:!border-slate-500 focus:!border-sky-400 focus:!shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-slate-300">Mật khẩu</span>}
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="!rounded-2xl !border-[rgba(148,163,184,0.16)] !bg-[#0b1120] !px-3 !py-3 !text-slate-200 placeholder:!text-slate-500 hover:!border-slate-500 focus:!border-sky-400 focus:!shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
                />
              </Form.Item>

              <div className="mb-6 flex items-center justify-between gap-4">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-slate-200">
                    Ghi nhớ đăng nhập
                  </Checkbox>
                </Form.Item>

                <a href="#" className="text-sm text-sky-300 no-underline">
                  Quên mật khẩu?
                </a>
              </div>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="!h-12 !rounded-2xl !border-none !bg-sky-400 !font-bold !text-sky-950 !shadow-none hover:!bg-sky-300 hover:!text-sky-950"
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
