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
    <div className="comment-form-wrap">
      <Form<CommentFormValues>
        form={form}
        layout="vertical"
        className="comment-form antd-comment-form"
        onFinish={handleFinish}
      >
        {showAuthorFields && (
          <div className="comment-form-row">
            <Form.Item
              label="Tên của bạn"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn" },
                { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên của bạn" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input placeholder="Nhập email của bạn" size="large" />
            </Form.Item>
          </div>
        )}

        <Form.Item
          label="Nội dung bình luận"
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
          />
        </Form.Item>

        <Form.Item className="comment-form-submit">
          <Button
            type="primary"
            htmlType="submit"
            className="comment-submit-btn"
            loading={loading}
            size="large"
          >
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
