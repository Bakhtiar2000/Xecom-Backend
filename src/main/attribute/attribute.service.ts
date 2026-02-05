import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AttributeRepository } from './attribute.repository';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
  CreateAttributeValueDto,
  UpdateAttributeValueDto,
} from './attribute.dto';

@Injectable()
export class AttributeService {
  constructor(private readonly attributeRepository: AttributeRepository) {}

  // ------------------------------- Get All Attributes -------------------------------
  public async getAllAttributes() {
    const attributes = await this.attributeRepository.findAllAttributes();
    return attributes;
  }

  // ------------------------------- Get Single Attribute -------------------------------
  public async getSingleAttribute(id: string) {
    const attribute = await this.attributeRepository.findAttributeById(id);

    if (!attribute) {
      throw new HttpException('Attribute not found', HttpStatus.NOT_FOUND);
    }

    return attribute;
  }

  // ------------------------------- Add Attribute -------------------------------
  public async addAttribute(createAttributeDto: CreateAttributeDto) {
    const { name } = createAttributeDto;

    // Check if attribute with this name already exists
    const existingAttribute =
      await this.attributeRepository.findAttributeByName(name);

    if (existingAttribute) {
      throw new HttpException(
        'Attribute with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const attribute = await this.attributeRepository.createAttribute({
      name,
    });

    return attribute;
  }

  // ------------------------------- Update Attribute -------------------------------
  public async updateAttribute(updateAttributeDto: UpdateAttributeDto) {
    const { id, name } = updateAttributeDto;

    // Check if attribute exists
    const existingAttribute =
      await this.attributeRepository.findAttributeById(id);

    if (!existingAttribute) {
      throw new HttpException('Attribute not found', HttpStatus.NOT_FOUND);
    }

    // If name is being updated, check if it's already in use
    if (name && name !== existingAttribute.name) {
      const nameExists =
        await this.attributeRepository.findAttributeByName(name);

      if (nameExists) {
        throw new HttpException(
          'Attribute with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const attribute = await this.attributeRepository.updateAttribute(id, {
      name,
    });

    return attribute;
  }

  // ------------------------------- Delete Attribute -------------------------------
  public async deleteAttribute(id: string) {
    // Check if attribute exists
    const attribute = await this.attributeRepository.findAttributeById(id);

    if (!attribute) {
      throw new HttpException('Attribute not found', HttpStatus.NOT_FOUND);
    }

    const deletedAttribute = await this.attributeRepository.deleteAttribute(id);

    return deletedAttribute;
  }

  // ------------------------------- Add Attribute Value -------------------------------
  public async addAttributeValue(
    createAttributeValueDto: CreateAttributeValueDto,
  ) {
    const { attributeId, value, hexCode } = createAttributeValueDto;

    // Check if attribute exists
    const attribute =
      await this.attributeRepository.findAttributeById(attributeId);

    if (!attribute) {
      throw new HttpException('Attribute not found', HttpStatus.NOT_FOUND);
    }

    // Check if value already exists for this attribute
    const existingValue =
      await this.attributeRepository.findAttributeValueByValueAndAttribute(
        value,
        attributeId,
      );

    if (existingValue) {
      throw new HttpException(
        'Attribute value already exists for this attribute',
        HttpStatus.CONFLICT,
      );
    }

    const attributeValue = await this.attributeRepository.createAttributeValue({
      value,
      attribute: {
        connect: { id: attributeId },
      },
    });

    return attributeValue;
  }

  // ------------------------------- Update Attribute Value -------------------------------
  public async updateAttributeValue(
    updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    const { id, value, hexCode } = updateAttributeValueDto;

    // Check if attribute value exists
    const existingValue =
      await this.attributeRepository.findAttributeValueById(id);

    if (!existingValue) {
      throw new HttpException(
        'Attribute value not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const attributeValue = await this.attributeRepository.updateAttributeValue(
      id,
      {
        value,
      },
    );

    return attributeValue;
  }

  // ------------------------------- Delete Attribute Value -------------------------------
  public async deleteAttributeValue(id: string) {
    // Check if attribute value exists
    const attributeValue =
      await this.attributeRepository.findAttributeValueById(id);

    if (!attributeValue) {
      throw new HttpException(
        'Attribute value not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedAttributeValue =
      await this.attributeRepository.deleteAttributeValue(id);

    return deletedAttributeValue;
  }
}
