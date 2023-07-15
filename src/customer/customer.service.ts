import { CustomerInterfaceResponse } from './interface/CustomerResponse.interface';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../entities/customer.schema';
import { CreateCustomerDto } from './dto/createCustomer-dto';
import { GetQueryDto } from './dto/query-dto';

@Injectable()
export class CustomerService {
  constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>) { }

  /*
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);

    if (!createdCustomer) {
      throw new InternalServerErrorException('Unable to create hotel');
    }

    return createdCustomer.save();
  }  */

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer | null> {
    // Check if a customer with the same details already exists
    const existingCustomer = await this.customerModel.findOne({
      email: createCustomerDto.email
      // Add additional properties if necessary for uniqueness check
  });
  
    if (existingCustomer) {
      // Customer with the same details already exists, throw an error
      throw new NotFoundException('Customer already exist');
    }
  
    // No existing customer found, create a new one
    const createdCustomer = await this.customerModel.create(createCustomerDto);
    return createdCustomer.save();
  }
  
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerModel.find({}, { password: 0 }).exec();
  }

  async getAllCustomerEmails(): Promise<string[]> {
    const customers = await this.customerModel.find().select('email');
    return customers.map((customer) => customer.email);
  }

  async getFilteredCustomers(queryDto: GetQueryDto): Promise<Customer[]> {
    const { search, limit, pageNumber, pageSize, fromDate, toDate } = queryDto;
    const query = this.customerModel.find();


    if (search) {
      query.or([
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { gender: { $regex: search, $options: 'i' } },

      ]);
    }

    if (pageNumber && pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      query.skip(skip).limit(pageSize);
    }

    if (fromDate && toDate) {
      query.where({
        date_of_birth: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    }

    return query.exec();

  }
/*
  async getCustomerById(id: string): Promise<CustomerInterfaceResponse | null> {
    const customerbyId = await this.customerModel.findById(id).exec();

    if (!customerbyId) {
      throw new InternalServerErrorException('Unable to find Customer');
    }

    return {
      code: 200,
      message: 'Customer found successfully',
      status: 'success',
      data: customerbyId,
    };
  }
  */

  async getCustomerById(id: string): Promise<CustomerInterfaceResponse> {
    try {
      const FoundCustomer = await this.customerModel.findByIdAndDelete(id).exec();
  
      if (!FoundCustomer) {
        throw new NotFoundException('Unable to find customer');
      }
        else{

            return {
                code: 200,
                message: 'Customer found successfully',
                status: 'success',
                data: FoundCustomer,
            };
        }
      }
     catch (error) {
      // Handle the specific CastError here
      if (error) {
        throw new NotFoundException('Invalid customer ID');
      }
  
      // Handle other potential errors or rethrow them
      throw error;
    }
  }

  async findOneWithUserName(username: string) {
    
    return await this.customerModel.findOne({ email: username });
    
  }

  /*
  async updateCustomer(id: string, updateCustomerDto: CreateCustomerDto): Promise<CustomerInterfaceResponse | null> {

    const updatedCustomer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();

    if (!updatedCustomer) {
      throw new InternalServerErrorException('Unable to update Customer');
    }

    return {
      code: 200,
      message: 'Customer updated successfully',
      status: 'success',
      data: updatedCustomer,
    };
  }
*/

 async updateCustomer(id: string, updateCustomerDto: CreateCustomerDto): Promise<CustomerInterfaceResponse> {
  try {
      const updatedCustomer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();

    if (!updatedCustomer) {
      throw new NotFoundException('Unable to update customer');
    }
      else{

          return {
              code: 200,
              message: 'Customer updated successfully',
              status: 'success',
              data: updatedCustomer,
          };
      }
    }
   catch (error) {
    // Handle the specific CastError here
    if (error) {
      throw new NotFoundException('Invalid customer ID');
    }

    // Handle other potential errors or rethrow them
    throw error;
  }
}

  async changePasswordCustomer(id: string, updateCustomerDto: CreateCustomerDto): Promise<CustomerInterfaceResponse | null> {

    const updatedCustomer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();

    if (!updatedCustomer) {
      throw new InternalServerErrorException('Unable to change Customer password');
    }

    return {
      code: 200,
      message: 'Customer password changed successfully',
      status: 'success',
      data: updatedCustomer,
    };
  }


  async updatePassword(email: string, newPassword: string): Promise<void> {
    const customer = await this.customerModel.findOne({ email });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  
    customer.password = newPassword;
    await customer.save();
  }

/*
  async deleteCustomer(id: string): Promise<CustomerInterfaceResponse | null> {
    //  return this.hotelModel.findByIdAndDelete(id).exec();
    const deletedCustomer = await this.customerModel.findByIdAndDelete(id);

    if (!deletedCustomer) {
      throw new InternalServerErrorException('Unable to delete Customer');
    }

    return {
      code: 200,
      message: 'Customer deleted successfully',
      status: 'success',
      data: deletedCustomer,
    };
  } */


  async deleteCustomer(id: string): Promise<CustomerInterfaceResponse
  > {
    try {
      const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
  
      if (!deletedCustomer) {
        throw new NotFoundException('Unable to delete customer');
      }
        else{

            return {
                code: 200,
                message: 'Customer deleted successfully',
                status: 'success',
                data: deletedCustomer,
            };
        }
      }
     catch (error) {
      // Handle the specific CastError here
      if (error) {
        throw new NotFoundException('Invalid customer ID');
      }
  
      // Handle other potential errors or rethrow them
      throw error;
    }
  }
}




