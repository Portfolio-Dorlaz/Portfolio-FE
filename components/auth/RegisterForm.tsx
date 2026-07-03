"use client";

import Link from "next/link";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/redux/slices/authSlice";

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
        }),
      ).unwrap();

      messageApi.success(`Đăng ký thành công: ${values.email}`);
      form.resetFields();
      router.push("/");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        messageApi.error(
          String((error as { message: unknown }).message) || "Đăng ký thất bại",
        );
      } else {
        messageApi.error("Đăng ký thất bại");
      }
    }
  };

  return (
    <>
      {contextHolder}

      <main className="grid min-h-screen items-center gap-8 bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-8 py-8 [background-image:radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,460px)] max-[900px]:grid-cols-1 max-[900px]:px-5 max-[900px]:py-5">
        <section className="px-8 text-slate-900 max-[900px]:px-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Create account
          </p>
          <h1 className="mb-4 text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.05] text-slate-900">
            Portfolio CMS
          </h1>
          <p className="text-base leading-[1.7] text-slate-600">
            Tạo tài khoản để bắt đầu quản lý nội dung cá nhân, project và bài
            viết trong hệ thống.
          </p>

          <div className="mt-10 grid max-w-[430px] gap-3">
            <span className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-100 px-[14px] py-2 text-[13px] font-bold text-blue-700">
              User register
            </span>
            <p className="text-base leading-[1.7] text-slate-600">
              Theo hướng kiến trúc bạn đang làm, route public register nên dành
              cho user thường; admin có thể tạo theo flow riêng.
            </p>
          </div>
        </section>

        <section className="flex justify-center">
          <Card
            variant="borderless"
            className="w-full rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            styles={{ body: { padding: 32 } }}
          >
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Register
              </p>
              <Title level={2} className="!mb-3 !text-slate-900">
                Đăng ký
              </Title>
              <Paragraph className="!mb-0 !text-base !leading-[1.7] !text-slate-600">
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
                label={<span className="text-slate-700">Họ tên</span>}
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input
                  placeholder="Tài Võ Tấn"
                  className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-3 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-400 focus:!bg-white focus:!shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-slate-700">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  placeholder="tai@example.com"
                  className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-3 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-400 focus:!bg-white focus:!shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-slate-700">Mật khẩu</span>}
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-3 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-400 focus:!bg-white focus:!shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-slate-700">Xác nhận mật khẩu</span>
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-3 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-400 focus:!bg-white focus:!shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
                />
              </Form.Item>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="!h-12 !rounded-2xl !border-none !bg-blue-600 !font-bold !text-white !shadow-none hover:!bg-blue-700 hover:!text-white"
                >
                  Tạo tài khoản
                </Button>
              </Form.Item>

              <Paragraph className="!mb-0 !mt-3 !text-slate-500">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-semibold text-blue-600">
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
