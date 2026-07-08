import {SourceIngestionGateway} from './ports/SourceIngestionGateway';
import {SourceFile} from '../domain/value-objects/SourceFile';
import {IngestionJob} from '../domain/entities/IngestionJob';

export interface StartSourceIngestionRequest {
  name: string;
  size: number;
  type: string;
}

export class StartSourceIngestionUseCase {
  constructor(private readonly gateway: SourceIngestionGateway) {}

  execute(request: StartSourceIngestionRequest): Promise<IngestionJob> {
    try {
      const sourceFile = SourceFile.create(request);

      return this.gateway.start(sourceFile);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
