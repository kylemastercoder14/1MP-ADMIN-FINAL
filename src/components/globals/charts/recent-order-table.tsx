"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RecentOrderTable = () => {
  return (
    <div>
      <h3 className="leading-none font-semibold mb-4">Recent Orders</h3>
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Ordered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#7823</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Kyle Andre Lim</h3>
                  <p className="text-xs w-30 truncate text-muted-foreground">
                    kylemastercoder14@gmail.com
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                  <h3 className="font-medium text-sm">Sip of Glory</h3>
                  <p className="text-xs text-muted-foreground">Coffee Shop</p>
                </div>
            </TableCell>
            <TableCell>6</TableCell>
            <TableCell>₱527.54</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-600"></div>
                <span className="text-green-600 text-sm">Completed</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <h3 className="text-sm font-medium">Sept 5, 2025</h3>
                <p className="text-xs text-muted-foreground">10:12 AM</p>
              </div>
            </TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>#7823</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Kyle Andre Lim</h3>
                  <p className="text-xs w-30 truncate text-muted-foreground">
                    kylemastercoder14@gmail.com
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                  <h3 className="font-medium text-sm">Sip of Glory</h3>
                  <p className="text-xs text-muted-foreground">Coffee Shop</p>
                </div>
            </TableCell>
            <TableCell>6</TableCell>
            <TableCell>₱527.54</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-600"></div>
                <span className="text-green-600 text-sm">Completed</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <h3 className="text-sm font-medium">Sept 5, 2025</h3>
                <p className="text-xs text-muted-foreground">10:12 AM</p>
              </div>
            </TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>#7823</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Kyle Andre Lim</h3>
                  <p className="text-xs w-30 truncate text-muted-foreground">
                    kylemastercoder14@gmail.com
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                  <h3 className="font-medium text-sm">Sip of Glory</h3>
                  <p className="text-xs text-muted-foreground">Coffee Shop</p>
                </div>
            </TableCell>
            <TableCell>6</TableCell>
            <TableCell>₱527.54</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-600"></div>
                <span className="text-blue-600 text-sm">Processing</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <h3 className="text-sm font-medium">Sept 5, 2025</h3>
                <p className="text-xs text-muted-foreground">10:12 AM</p>
              </div>
            </TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>#7823</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Kyle Andre Lim</h3>
                  <p className="text-xs w-30 truncate text-muted-foreground">
                    kylemastercoder14@gmail.com
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                  <h3 className="font-medium text-sm">Sip of Glory</h3>
                  <p className="text-xs text-muted-foreground">Coffee Shop</p>
                </div>
            </TableCell>
            <TableCell>6</TableCell>
            <TableCell>₱527.54</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-yellow-600"></div>
                <span className="text-yellow-600 text-sm">Pending</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <h3 className="text-sm font-medium">Sept 5, 2025</h3>
                <p className="text-xs text-muted-foreground">10:12 AM</p>
              </div>
            </TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>#7823</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Kyle Andre Lim</h3>
                  <p className="text-xs w-30 truncate text-muted-foreground">
                    kylemastercoder14@gmail.com
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                  <h3 className="font-medium text-sm">Sip of Glory</h3>
                  <p className="text-xs text-muted-foreground">Coffee Shop</p>
                </div>
            </TableCell>
            <TableCell>6</TableCell>
            <TableCell>₱527.54</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-600"></div>
                <span className="text-red-600 text-sm">Cancelled</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <h3 className="text-sm font-medium">Sept 5, 2025</h3>
                <p className="text-xs text-muted-foreground">10:12 AM</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrderTable;
