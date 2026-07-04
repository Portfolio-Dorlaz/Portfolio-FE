"use client";

import { useEffect } from "react";
import { Button, Form, Input } from "antd";

const { TextArea } = Input;

export type CommentFormValues = {
  fullName?: string;
  email?: string;
  content: string;
};

type CommentFormProps = {
  loading?: boolean;
  initialValues?: Partial<CommentFormValues>;
  submitText?: string;
  showAuthorFields?: boolean;
  onSubmit: (values: CommentFormValues) => void | Promise<void>;
};

export default function CommentForm({
  loading = false,
  initialValues,
  submitText = "Gửi bình luận",
  showAuthorFields = true,
  onSubmit,
}: CommentFormProps) {
  const [form] = Form.useForm<CommentFormValues>();

  useEffect(() => {
    form.setFieldsValue({
      fullName: initialValues?.fullName || "",
      email: initialValues?.email || "",
      content: initialValues?.content || "",
    });
  }, [form, initialValues]);

  const handleFinish = async (values: CommentFormValues) => {
    await onSubmit(values);

    form.resetFields();

    if (!showAuthorFields) {
      form.setFieldsValue({
        content: "",
      });
    }
  };

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/92 p-[22px] shadow-[0_14px_34px_rgba(37,99,235,0.06)] backdrop-blur">
      <Form<CommentFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-0"
      >
        {showAuthorFields && (
          <div className="mb-[14px] grid grid-cols-2 gap-[14px] max-[768px]:grid-cols-1">
            <Form.Item
              label={
                <span className="font-medium text-slate-700">Tên của bạn</span>
              }
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn" },
                { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
              ]}
            >
              <Input
                placeholder="Nhập tên của bạn"
                size="large"
                className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-slate-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input
                placeholder="Nhập email của bạn"
                size="large"
                className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
              />
            </Form.Item>
          </div>
        )}

        <Form.Item
          label={
            <span className="font-medium text-slate-700">
              Nội dung bình luận
            </span>
          }
          name="content"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung bình luận" },
            { min: 3, message: "Bình luận phải có ít nhất 3 ký tự" },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Viết bình luận của bạn..."
            maxLength={1000}
            showCount
            className="!rounded-2xl !border-slate-200 !bg-slate-50 !px-4 !py-3 !text-slate-900 placeholder:!text-slate-400 hover:!border-slate-300 focus:!border-blue-500 focus:!bg-white focus:!shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
          />
        </Form.Item>

        <Form.Item className="!mb-0 !mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="!mt-0 !inline-flex !h-auto !items-center !justify-center !rounded-full !border-0 !bg-blue-600 !px-5 !py-3 !text-sm !font-bold !text-white !shadow-[0_14px_24px_rgba(37,99,235,0.18)] hover:!translate-y-[-1px] hover:!bg-blue-700"
          >
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
