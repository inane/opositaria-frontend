import {SourceIngestionGateway} from './ports/SourceIngestionGateway';
import {SourceFile} from '../domain/value-objects/SourceFile';
import {IngestionJob} from '../domain/entities/IngestionJob';

export class StartSourceIngestionUseCase {
  constructor(private readonly gateway: SourceIngestionGateway) {}

  execute(sourceFile: SourceFile): Promise<IngestionJob> {
    return this.gateway.start(sourceFile);
  }
}
