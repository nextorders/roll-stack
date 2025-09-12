import { useDatabase } from '../database'
import { Activity } from './activity'
import { Channel } from './channel'
import { Chat } from './chat'
import { Checkout } from './checkout'
import { City } from './city'
import { Client } from './client'
import { Epic } from './epic'
import { Feedback } from './feedback'
import { File } from './file'
import { Flow } from './flow'
import { Kitchen } from './kitchen'
import { Locker } from './locker'
import { Media } from './media'
import { Menu } from './menu'
import { Network } from './network'
import { Notification } from './notification'
import { Partner } from './partner'
import { Payment } from './payment'
import { Permission } from './permission'
import { Post } from './post'
import { Print } from './print'
import { Product } from './product'
import { Task } from './task'
import { Telegram } from './telegram'
import { Ticket } from './ticket'
import { User } from './user'

class Repository {
  readonly activity = Activity
  readonly channel = Channel
  readonly chat = Chat
  readonly checkout = Checkout
  readonly city = City
  readonly client = Client
  readonly epic = Epic
  readonly feedback = Feedback
  readonly file = File
  readonly flow = Flow
  readonly kitchen = Kitchen
  readonly locker = Locker
  readonly media = Media
  readonly menu = Menu
  readonly network = Network
  readonly notification = Notification
  readonly partner = Partner
  readonly payment = Payment
  readonly permission = Permission
  readonly post = Post
  readonly print = Print
  readonly product = Product
  readonly task = Task
  readonly telegram = Telegram
  readonly ticket = Ticket
  readonly user = User

  async checkHealth(): Promise<boolean> {
    await useDatabase().query.users.findFirst()
    return true
  }
}

export const repository = new Repository()
