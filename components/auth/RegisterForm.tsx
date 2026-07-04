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

      <main className="grid min-h-screen items-center gap-10 overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-6 py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,460px)] lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_26%)]" />

        <section className="relative z-10 px-1 text-slate-900 lg:px-6">
          <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 backdrop-blur">
            Public account
          </p>

          <h1 className="mb-4 max-w-[10ch] text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[1.02] text-slate-900">
            Create your account.
          </h1>

          <p className="max-w-[560px] text-base leading-8 text-slate-600">
            Tạo tài khoản để bình luận và tương tác với nội dung trong
            portfolio. Tài khoản này không dùng để tạo bài viết, chỉnh sửa post
            hoặc truy cập khu vực quản trị CMS.
          </p>

          <div className="mt-10 grid max-w-[560px] gap-3">
            <span className="inline-flex w-fit rounded-full border border-blue-200 bg-white px-4 py-2 text-[13px] font-semibold text-blue-700">
              Comment access only
            </span>

            <p className="text-base leading-7 text-slate-600">
              Phù hợp cho người dùng muốn đăng nhập để bình luận. Các chức năng
              quản lý nội dung chỉ dành cho admin hoặc editor riêng.
            </p>
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
                Register
              </p>
              <Title level={2} className="!mb-2 !text-slate-900">
                Đăng ký
              </Title>
              <Paragraph className="!mb-0 !text-base !leading-7 !text-slate-600">
                Điền thông tin để tạo tài khoản bình luận trong portfolio.
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
                label={
                  <span className="font-medium text-slate-700">Họ tên</span>
                }
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input
                  placeholder="Tài Võ Tấn"
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !text-slate-900 placeholder:!text-slate-400 hover:!border-blue-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
              </Form.Item>

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
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !text-slate-900 placeholder:!text-slate-400 hover:!border-blue-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-slate-700">
                    Xác nhận mật khẩu
                  </span>
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
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !text-slate-900 placeholder:!text-slate-400 hover:!border-blue-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
              </Form.Item>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="!h-12 !rounded-2xl !border-none !bg-blue-600 !font-bold !text-white !shadow-[0_10px_24px_rgba(37,99,235,0.22)] hover:!bg-blue-700 hover:!text-white"
                >
                  Tạo tài khoản
                </Button>
              </Form.Item>

              <Paragraph className="!mb-0 !mt-4 !text-slate-500">
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
