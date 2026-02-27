"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ShoppingCart,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  total: number;
  notes: string;
  estimatedTime: string;
}

const STATUS_CONFIG = {
  pending: {
    label: "Chờ Xác Nhận",
    color: "bg-yellow-600/20 text-yellow-300",
    icon: Clock,
  },
  confirmed: {
    label: "Đã Xác Nhận",
    color: "bg-blue-600/20 text-blue-300",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Đang Chuẩn Bị",
    color: "bg-purple-600/20 text-purple-300",
    icon: Clock,
  },
  ready: {
    label: "Sẵn Sàng",
    color: "bg-emerald-600/20 text-emerald-300",
    icon: CheckCircle2,
  },
  delivered: {
    label: "Đã Giao",
    color: "bg-teal-600/20 text-teal-300",
    icon: Truck,
  },
  cancelled: {
    label: "Đã Hủy",
    color: "bg-red-600/20 text-red-300",
    icon: AlertCircle,
  },
};

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    createdAt: "2026-02-10 14:30",
    status: "ready",
    items: [
      { name: "Phở Bò Tái Chín", quantity: 2, price: 75000 },
      { name: "Bánh Mì Thịt Nướng", quantity: 1, price: 35000 },
      { name: "Nước Cam", quantity: 2, price: 15000 },
    ],
    total: 215000,
    notes: "Ít gia vị",
    estimatedTime: "15 phút",
  },
  {
    id: "ORD-002",
    createdAt: "2026-02-09 19:00",
    status: "delivered",
    items: [
      { name: "Cơm Tấm Sườn Bì", quantity: 1, price: 55000 },
      { name: "Chè Ba Màu", quantity: 1, price: 25000 },
    ],
    total: 80000,
    notes: "Thêm nước mắm",
    estimatedTime: "0 phút",
  },
  {
    id: "ORD-003",
    createdAt: "2026-02-08 12:30",
    status: "cancelled",
    items: [{ name: "Bún Chả Hà Nội", quantity: 1, price: 65000 }],
    total: 65000,
    notes: "",
    estimatedTime: "-",
  },
];

export default function MyOrdersPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const StatusIcon = selectedOrder
    ? STATUS_CONFIG[selectedOrder.status].icon
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-slate-400 text-lg">
            Xem trạng thái đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart size={24} className="text-emerald-400" />
                Danh Sách Đơn Hàng
              </h2>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Chưa có đơn hàng nào
                  </p>
                ) : (
                  orders.map((order) => {
                    const statusConfig = STATUS_CONFIG[order.status];
                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                          selectedOrder?.id === order.id
                            ? "bg-emerald-600/20 border-emerald-500/50"
                            : "bg-slate-700/30 border-slate-700/50 hover:border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p
                            className={`font-semibold ${selectedOrder?.id === order.id ? "text-white" : "text-slate-300"}`}
                          >
                            {order.id}
                          </p>
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          {order.createdAt}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-2 ${selectedOrder?.id === order.id ? "text-emerald-400" : "text-slate-300"}`}
                        >
                          {order.total.toLocaleString()}đ
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2 animate-fade-in-right">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Status Overview */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-black text-white">
                        {selectedOrder.id}
                      </h2>
                      <Badge
                        className={`${STATUS_CONFIG[selectedOrder.status].color} text-lg px-4 py-2`}
                      >
                        {STATUS_CONFIG[selectedOrder.status].label}
                      </Badge>
                    </div>
                    <p className="text-slate-400">
                      Đặt hàng lúc: {selectedOrder.createdAt}
                    </p>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-3">
                    {(
                      ["pending", "confirmed", "preparing", "ready"] as const
                    ).map((status) => {
                      const isActive =
                        ["pending", "confirmed", "preparing", "ready"].indexOf(
                          status,
                        ) <=
                        ["pending", "confirmed", "preparing", "ready"].indexOf(
                          selectedOrder.status as any,
                        );
                      const StatusIcon = STATUS_CONFIG[status].icon;
                      return (
                        <div
                          key={status}
                          className={`flex items-center gap-3 ${isActive ? "opacity-100" : "opacity-50"}`}
                        >
                          <div
                            className={`p-2 rounded-full ${isActive ? "bg-emerald-600/30" : "bg-slate-700/30"}`}
                          >
                            <StatusIcon
                              size={20}
                              className={
                                isActive ? "text-emerald-400" : "text-slate-600"
                              }
                            />
                          </div>
                          <span
                            className={
                              isActive
                                ? "text-white font-semibold"
                                : "text-slate-600"
                            }
                          >
                            {STATUS_CONFIG[status].label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {selectedOrder.status !== "cancelled" &&
                    selectedOrder.status !== "delivered" && (
                      <div className="mt-6 p-4 bg-emerald-600/20 border border-emerald-500/50 rounded-lg">
                        <p className="text-emerald-300 font-semibold">
                          ⏱️ Thời gian dự kiến: {selectedOrder.estimatedTime}
                        </p>
                      </div>
                    )}
                </Card>

                {/* Order Items */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Chi Tiết Đơn Hàng
                  </h3>

                  <div className="space-y-3 mb-6">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-700/50"
                      >
                        <div>
                          <p className="text-white font-semibold">
                            {item.name}
                          </p>
                          <p className="text-slate-400 text-sm">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <span className="text-emerald-400 font-bold">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        Tổng Cộng:
                      </span>
                      <span className="text-3xl font-black text-emerald-400">
                        {selectedOrder.total.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                      <p className="text-slate-400 text-sm mb-2">Ghi chú:</p>
                      <p className="text-white">{selectedOrder.notes}</p>
                    </div>
                  )}
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold gap-2">
                    <Phone size={18} />
                    Liên Hệ Hỗ Trợ
                  </Button>
                  <Link href="/customer/orders" className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2">
                      Gọi Thêm Món
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <ShoppingCart
                    size={48}
                    className="text-slate-500 mx-auto mb-4"
                  />
                  <p className="text-slate-400 text-lg">
                    Không có đơn hàng nào
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
